import SwiftUI

struct Theme {
    static let primary = Color("PrimaryColor") // Will fallback to default blue if not in Assets
    static let secondary = Color("SecondaryColor")
    static let background = Color("BackgroundColor")
    static let cardBackground = Color("CardBackgroundColor")
    static let textPrimary = Color.primary
    static let textSecondary = Color.secondary
    
    // Status Colors
    static let pending = Color.red
    static let inProgress = Color.blue
    static let completed = Color.green
    
    // Gradients
    static let primaryGradient = LinearGradient(
        gradient: Gradient(colors: [Color.blue, Color.purple]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    // Typography standardizations
    struct Typography {
        static let title = Font.system(size: 28, weight: .bold, design: .rounded)
        static let subtitle = Font.system(size: 18, weight: .semibold, design: .rounded)
        static let body = Font.system(size: 16, weight: .regular, design: .rounded)
        static let caption = Font.system(size: 14, weight: .medium, design: .rounded)
    }
    
    // Styling constants
    static let cornerRadius: CGFloat = 16
    static let padding: CGFloat = 16
    static let shadowRadius: CGFloat = 8
}

// Default fallbacks if color assets are missing during development
extension Color {
    init(_ name: String) {
        switch name {
        case "PrimaryColor": self = .blue
        case "SecondaryColor": self = .gray
        case "BackgroundColor": self = Color(UIColor.systemBackground)
        case "CardBackgroundColor": self = Color(UIColor.secondarySystemBackground)
        default: self = .clear
        }
    }
}
