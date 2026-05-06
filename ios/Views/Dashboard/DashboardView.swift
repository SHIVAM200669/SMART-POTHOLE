import SwiftUI

struct DashboardView: View {
    @StateObject private var viewModel = DashboardViewModel()
    @EnvironmentObject var authViewModel: AuthViewModel
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    
                    // Stats Header
                    HStack(spacing: 16) {
                        StatCard(title: "Pending", count: viewModel.pendingCount, color: Theme.pending)
                        StatCard(title: "In Progress", count: viewModel.inProgressCount, color: Theme.inProgress)
                        StatCard(title: "Completed", count: viewModel.completedCount, color: Theme.completed)
                    }
                    .padding(.horizontal)
                    
                    Text("Recent Reports")
                        .font(Theme.Typography.subtitle)
                        .padding(.horizontal)
                        .padding(.top, 10)
                    
                    if viewModel.isLoading {
                        ForEach(0..<3) { _ in
                            SkeletonLoader()
                                .frame(height: 250)
                                .padding(.horizontal)
                        }
                    } else if viewModel.reports.isEmpty {
                        VStack {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 50))
                                .foregroundColor(Theme.completed)
                            Text("No recent reports. Great job!")
                                .font(Theme.Typography.body)
                                .foregroundColor(Theme.textSecondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, 40)
                    } else {
                        LazyVStack(spacing: 16) {
                            ForEach(viewModel.reports) { report in
                                PotholeCard(report: report)
                                    .padding(.horizontal)
                            }
                        }
                    }
                }
                .padding(.vertical)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Dashboard")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        authViewModel.logout()
                    }) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .foregroundColor(Theme.textPrimary)
                    }
                }
            }
            .onAppear {
                viewModel.fetchReports()
            }
            .refreshable {
                viewModel.fetchReports()
            }
        }
    }
}

struct StatCard: View {
    let title: String
    let count: Int
    let color: Color
    
    var body: some View {
        VStack(alignment: .center, spacing: 8) {
            Text("\(count)")
                .font(.system(size: 24, weight: .bold, design: .rounded))
                .foregroundColor(color)
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Theme.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Theme.cardBackground)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}
