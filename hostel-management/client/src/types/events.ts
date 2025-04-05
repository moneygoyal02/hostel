import React from 'react';

// Common event handler types
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type FormSubmitEvent = React.FormEvent;
export type MouseEvent = React.MouseEvent<HTMLElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;

// Higher-order type for handling onChange events with controlled inputs
export type InputChangeHandler = (e: InputChangeEvent) => void;
export type TextAreaChangeHandler = (e: TextAreaChangeEvent) => void;
export type SelectChangeHandler = (e: SelectChangeEvent) => void;
export type FormSubmitHandler = (e: FormSubmitEvent) => void;
export type FileChangeHandler = (e: FileChangeEvent) => void; 