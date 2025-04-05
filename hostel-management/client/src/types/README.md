# TypeScript Type System

This document outlines the type system for the Hostel Management Application.

## Core Types (from `types/index.ts`)

- `UserInfo`: Used in AuthContext and user-related components
- `Hostel`: Used in HostelDetail, WardenDashboard, and hostel-related components
- `StaffMember`: Used in StaffManagement component
- `Facility`: Used for hostel facilities
- `Image`: Used for slider images, gallery images, and mess images
- `MessMenu`: Used in MessMenuManagement component
- `LoginForm`: Used in Login component
- `SignupForm`: Used in Signup component

## Event Handler Types (from `types/events.ts`)

- Form events:
  - `FormSubmitHandler`: For form submission
  - `FormSubmitEvent`: Type for form submission events
  
- Input events:
  - `InputChangeHandler`: For text/number/date inputs
  - `TextAreaChangeHandler`: For textarea inputs
  - `SelectChangeHandler`: For select dropdowns
  - `FileChangeHandler`: For file inputs
  
- Mouse events:
  - `MouseEvent`: Generic mouse events
  - `ButtonClickEvent`: For button clicks

## Usage Guidelines

1. Always import types from the central types files instead of defining them in components
2. Use proper event handler types for all event handling functions
3. Keep the interfaces consistent across components
4. If a new type is needed in multiple components, add it to the types/index.ts file 