import SwiftUI

struct PotholeCard: View {
    let report: Report
    
    var statusColor: Color {
        switch report.status.lowercased() {
        case "pending": return Theme.pending
        case "in-progress": return Theme.inProgress
        case "completed": return Theme.completed
        default: return Theme.textSecondary
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Placeholder for image - since we might not have a reliable async image immediately available
            AsyncImage(url: URL(string: report.imageUrl)) { phase in
                switch phase {
                case .empty:
                    SkeletonLoader()
                        .frame(height: 150)
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(height: 150)
                        .clipped()
                case .failure:
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: 150)
                        .overlay(Image(systemName: "photo").foregroundColor(.gray))
                @unknown default:
                    EmptyView()
                }
            }
            .cornerRadius(Theme.cornerRadius)
            
            HStack {
                Text(report.status.uppercased())
                    .font(Theme.Typography.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(statusColor.opacity(0.2))
                    .foregroundColor(statusColor)
                    .cornerRadius(8)
                
                Spacer()
                
                Text(report.createdAt.prefix(10)) // simple date formatting
                    .font(Theme.Typography.caption)
                    .foregroundColor(Theme.textSecondary)
            }
            
            if let desc = report.description, !desc.isEmpty {
                Text(desc)
                    .font(Theme.Typography.body)
                    .lineLimit(2)
            }
            
            if let score = report.confidenceScore {
                HStack {
                    Image(systemName: "brain")
                    Text("AI Confidence: \(Int(score * 100))%")
                }
                .font(Theme.Typography.caption)
                .foregroundColor(Theme.textSecondary)
            }
        }
        .padding(Theme.padding)
        .background(Theme.cardBackground)
        .cornerRadius(Theme.cornerRadius)
        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
    }
}
