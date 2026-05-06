import SwiftUI
import MapKit

struct MapView: View {
    @StateObject private var viewModel = MapViewModel()
    @State private var selectedReport: Report?
    
    var body: some View {
        NavigationView {
            ZStack {
                Map(coordinateRegion: $viewModel.region, annotationItems: viewModel.reports) { report in
                    MapAnnotation(coordinate: CLLocationCoordinate2D(latitude: report.locationLat, longitude: report.locationLng)) {
                        VStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .font(.title2)
                                .foregroundColor(viewModel.getColor(for: report.status))
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(radius: 3)
                        }
                        .onTapGesture {
                            selectedReport = report
                        }
                    }
                }
                .ignoresSafeArea(edges: .top)
                
                // Overlay for selected report details
                if let report = selectedReport {
                    VStack {
                        Spacer()
                        PotholeCard(report: report)
                            .padding()
                            .overlay(
                                Button(action: {
                                    selectedReport = nil
                                }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(.gray)
                                        .font(.title)
                                }
                                .padding(24)
                                , alignment: .topTrailing
                            )
                    }
                    .transition(.move(edge: .bottom))
                    .animation(.spring(), value: selectedReport != nil)
                }
            }
            .navigationTitle("Pothole Map")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                viewModel.fetchMapMarkers()
            }
        }
    }
}
