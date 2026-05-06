import SwiftUI

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Theme.Typography.subtitle)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding()
            .background(Theme.primaryGradient)
            .cornerRadius(Theme.cornerRadius)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.easeOut(duration: 0.2), value: configuration.isPressed)
            .shadow(color: Theme.primary.opacity(0.3), radius: Theme.shadowRadius, x: 0, y: 4)
    }
}

struct CustomTextFieldStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Theme.cardBackground)
            .cornerRadius(Theme.cornerRadius)
            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.cornerRadius)
                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
            )
    }
}

extension View {
    func customTextField() -> some View {
        self.modifier(CustomTextFieldStyle())
    }
}

// Skeleton Loader Component
struct SkeletonLoader: View {
    @State private var isAnimating = false
    
    var body: some View {
        Rectangle()
            .fill(Color.gray.opacity(0.2))
            .cornerRadius(8)
            .opacity(isAnimating ? 0.5 : 1.0)
            .onAppear {
                withAnimation(Animation.easeInOut(duration: 1.0).repeatForever(autoreverses: true)) {
                    isAnimating = true
                }
            }
    }
}
