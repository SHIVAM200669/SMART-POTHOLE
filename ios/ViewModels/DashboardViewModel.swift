import Foundation

class DashboardViewModel: ObservableObject {
    @Published var reports: [Report] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    var pendingCount: Int { reports.filter { $0.status == "pending" }.count }
    var inProgressCount: Int { reports.filter { $0.status == "in-progress" }.count }
    var completedCount: Int { reports.filter { $0.status == "completed" }.count }
    
    func fetchReports() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let fetchedReports: [Report] = try await NetworkManager.shared.request(url: Constants.API.complaints)
                DispatchQueue.main.async {
                    self.reports = fetchedReports
                    self.isLoading = false
                }
            } catch {
                DispatchQueue.main.async {
                    self.errorMessage = "Failed to fetch reports: \(error.localizedDescription)"
                    self.isLoading = false
                }
            }
        }
    }
}
