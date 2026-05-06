import SwiftUI
import PhotosUI

struct NewReportView: View {
    @StateObject private var viewModel = ReportViewModel()
    @StateObject private var locationManager = LocationManager()
    
    @State private var selectedItem: PhotosPickerItem? = nil
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    
                    // Image Selection
                    ZStack {
                        if let image = viewModel.selectedImage {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFill()
                                .frame(height: 250)
                                .clipShape(RoundedRectangle(cornerRadius: Theme.cornerRadius))
                        } else {
                            RoundedRectangle(cornerRadius: Theme.cornerRadius)
                                .fill(Theme.cardBackground)
                                .frame(height: 250)
                                .overlay(
                                    VStack(spacing: 12) {
                                        Image(systemName: "camera.viewfinder")
                                            .font(.system(size: 40))
                                            .foregroundColor(Theme.primary)
                                        Text("Tap to select image")
                                            .font(Theme.Typography.subtitle)
                                            .foregroundColor(Theme.textSecondary)
                                    }
                                )
                        }
                        
                        PhotosPicker(
                            selection: $selectedItem,
                            matching: .images,
                            photoLibrary: .shared()) {
                                Rectangle()
                                    .fill(Color.clear)
                                    .frame(height: 250)
                            }
                            .onChange(of: selectedItem) { newItem in
                                Task {
                                    if let data = try? await newItem?.loadTransferable(type: Data.self),
                                       let uiImage = UIImage(data: data) {
                                        DispatchQueue.main.async {
                                            viewModel.selectedImage = uiImage
                                        }
                                    }
                                }
                            }
                    }
                    .padding(.horizontal)
                    
                    // Location Indicator
                    HStack {
                        Image(systemName: "location.fill")
                            .foregroundColor(locationManager.location != nil ? Theme.completed : Theme.pending)
                        
                        if let loc = locationManager.location {
                            Text("Location acquired (\(loc.coordinate.latitude.formatted(.number.precision(.fractionLength(4)))), \(loc.coordinate.longitude.formatted(.number.precision(.fractionLength(4)))))")
                                .font(Theme.Typography.caption)
                                .foregroundColor(Theme.textSecondary)
                        } else {
                            Text("Acquiring GPS location...")
                                .font(Theme.Typography.caption)
                                .foregroundColor(Theme.textSecondary)
                        }
                        Spacer()
                    }
                    .padding(.horizontal)
                    
                    // Description
                    VStack(alignment: .leading) {
                        Text("Description")
                            .font(Theme.Typography.subtitle)
                        
                        TextEditor(text: $viewModel.description)
                            .frame(height: 100)
                            .padding(8)
                            .background(Theme.cardBackground)
                            .cornerRadius(8)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                            )
                    }
                    .padding(.horizontal)
                    
                    // Status Messages
                    if let error = viewModel.errorMessage {
                        Text(error)
                            .foregroundColor(.red)
                            .font(Theme.Typography.caption)
                    }
                    if let success = viewModel.successMessage {
                        Text(success)
                            .foregroundColor(Theme.completed)
                            .font(Theme.Typography.caption)
                    }
                    
                    // Submit Button
                    Button(action: {
                        viewModel.submitReport(location: locationManager.location)
                    }) {
                        if viewModel.isSubmitting {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Submit Report")
                        }
                    }
                    .buttonStyle(PrimaryButtonStyle())
                    .padding(.horizontal)
                    .disabled(viewModel.isSubmitting || viewModel.selectedImage == nil)
                    
                }
                .padding(.vertical)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("New Report")
            .onAppear {
                locationManager.requestPermission()
                locationManager.startUpdating()
            }
            .onDisappear {
                locationManager.stopUpdating()
            }
        }
    }
}
