## B2B schema

```mermaid
erDiagram
User {
uuid id PK
string name
string email
}
Company {
uuid id PK
string name
string slug
string logoUrl
string ruc
string website
string primaryColor
enum onboardingStep
bool isActive
}
CompanyPreference {
uuid id PK
uuid companyId FK
string seekingTypes
}
CompanyMember {
uuid id PK
uuid companyId FK
uuid userId FK
enum role
enum status
uuid invitedBy
datetime joinedAt
}
CompanyInvitation {
uuid id PK
uuid companyId FK
string email
enum role
string token
string codeHash
enum status
uuid invitedBy
datetime expiresAt
datetime usedAt
}
CompanyNotification {
uuid id PK
uuid companyId FK
uuid userId
string type
string title
string body
datetime readAt
}
Feature {
string id PK
string name
string description
string category
bool isActive
}
RolePermission {
uuid id PK
string featureId FK
enum role
bool canRead
bool canWrite
bool canDelete
}
CompanyFeatureFlag {
uuid id PK
uuid companyId FK
string featureId FK
bool enabled
uuid overrideBy
datetime expiresAt
}

User ||--o{ CompanyMember : "pertenece a"
Company ||--o1 CompanyPreference : "tiene"
Company ||--o{ CompanyMember : "tiene"
Company ||--o{ CompanyInvitation : "genera"
Company ||--o{ CompanyNotification : "emite"
Company ||--o{ CompanyFeatureFlag : "tiene"
Feature ||--o{ RolePermission : "define"
Feature ||--o{ CompanyFeatureFlag : "controla"
```
