import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "square.grid.2x2")
                }
            
            MapView()
                .tabItem {
                    Label("Map", systemImage: "map")
                }
            
            NewReportView()
                .tabItem {
                    Label("Report", systemImage: "plus.circle.fill")
                }
        }
        .accentColor(Theme.primary)
    }
}
