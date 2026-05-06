import SwiftUI
import MapKit

class MapViewModel: ObservableObject {
    @Published var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194), // Default to SF or configure based on user
        span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
    )
    
    @Published var reports: [Report] = []
    
    func fetchMapMarkers() {
        Task {
            do {
                let fetchedReports: [Report] = try await NetworkManager.shared.request(url: Constants.API.complaints)
                DispatchQueue.main.async {
                    self.reports = fetchedReports
                }
            } catch {
                print("Error fetching reports for map: \(error)")
            }
        }
    }
    
    func getColor(for status: String) -> Color {
        switch status.lowercased() {
        case "pending": return Theme.pending
        case "in-progress": return Theme.inProgress
        case "completed": return Theme.completed
        default: return Theme.textSecondary
        }
    }
}
