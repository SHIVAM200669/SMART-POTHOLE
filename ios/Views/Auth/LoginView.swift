import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @State private var showingSignup = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Spacer()
                
                // Logo or App Name
                VStack(spacing: 8) {
                    Image(systemName: "road.lanes")
                        .font(.system(size: 60))
                        .foregroundColor(Theme.primary)
                    Text("Smart Pothole")
                        .font(Theme.Typography.title)
                    Text("Welcome back, keep the roads safe!")
                        .font(Theme.Typography.body)
                        .foregroundColor(Theme.textSecondary)
                }
                .padding(.bottom, 32)
                
                VStack(spacing: 16) {
                    TextField("Email", text: $viewModel.email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .customTextField()
                    
                    SecureField("Password", text: $viewModel.password)
                        .customTextField()
                }
                
                if let error = viewModel.errorMessage {
                    Text(error)
                        .foregroundColor(.red)
                        .font(Theme.Typography.caption)
                }
                
                Button(action: {
                    viewModel.login()
                }) {
                    if viewModel.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text("Log In")
                    }
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(viewModel.isLoading)
                
                Spacer()
                
                HStack {
                    Text("Don't have an account?")
                        .foregroundColor(Theme.textSecondary)
                    NavigationLink("Sign Up", destination: SignupView(viewModel: viewModel))
                        .foregroundColor(Theme.primary)
                        .font(.system(size: 16, weight: .bold))
                }
                .padding(.bottom, 24)
            }
            .padding()
            .background(Theme.background.ignoresSafeArea())
            .navigationBarHidden(true)
        }
    }
}
