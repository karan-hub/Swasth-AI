# System Architecture Diagram

This diagram shows the user interaction flow with different system components.
```mermaid
---
config:
  layout: elk
---
flowchart TD
    U[/"👤 User"/]
    
    %% Authentication Flow
    U -->|"1. Login Details"| P1(("1.0<br/>Authentication"))
    P1 -->|"2. Verify"| DB1[("User DB")]
    DB1 -->|"3. User Info"| P1
    P1 -->|"4. Auth Token"| U
    
    %% Chat Flow
    U -->|"5. Send Message"| P2(("2.0<br/>Chat"))
    P2 -->|"6. Store"| DB2[("Message DB")]
    DB2 -->|"7. Retrieve"| P2
    P2 -->|"8. Delivered"| U
    
    %% Reminder Flow
    U -->|"9. Set Reminder"| P3(("3.0<br/>Reminder"))
    P3 -->|"10. Save"| DB3[("Reminder DB")]
    DB3 -->|"11. Get Data"| P3
    P3 -->|"12. Notification"| U
    
    %% Call Flow
    U -->|"13. Initiate Call"| P4(("4.0<br/>Calling"))
    P4 -->|"14. Log"| DB4[("Call Log DB")]
    DB4 -->|"15. History"| P4
    P4 -->|"16. Connection"| U
    
    %% AI Query Flow
    U -->|"17. Ask Query"| P5(("5.0<br/>AI Query"))
    P5 -->|"18. Fetch"| DB5[("Knowledge DB")]
    DB5 -->|"19. Knowledge"| P5
    P5 -->|"20. Store History"| DB1
    P5 -->|"21. Response"| U
    
    style U fill:#BBDEFB,stroke:#1565C0,stroke-width:3px
    style P1 fill:#FFF9C4,stroke:#F9A825,stroke-width:2px
    style P2 fill:#E1F5DD,stroke:#4CAF50,stroke-width:2px
    style P3 fill:#FFE5CC,stroke:#F57C00,stroke-width:2px
    style P4 fill:#FCE4EC,stroke:#C2185B,stroke-width:2px
    style P5 fill:#EDE7F6,stroke:#7B1FA2,stroke-width:2px
    style DB1 fill:#FFEBEE,stroke:#C62828,stroke-width:2px
    style DB2 fill:#E8F5E9,stroke:#388E3C,stroke-width:2px
    style DB3 fill:#FFF3E0,stroke:#E65100,stroke-width:2px
    style DB4 fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px
    style DB5 fill:#E0F2F1,stroke:#00695C,stroke-width:2px
```

## System Components:
- **Authentication**: User login and verification
- **Chat**: Messaging functionality
- **Reminder**: Notification system
- **Calling**: Voice/video calls
- **AI Query**: AI-powered assistance
