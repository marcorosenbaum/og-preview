# og-preview

Please note: Package is still in development process.

`og-preview` is a handy CLI tool for developers to preview all available Open Graph meta data from their local development server. This allows you to check how your project's Open Graph data will appear on social media platforms without deploying your project.

## Installation

To install `og-preview` globally, run the following command:

```sh
npm install -g og-preview
```

You can then use the package for all projects you are working on.

## Usage

Ensure your project is running on your local development server. For example, if your project is running at http://localhost:5173, you can use og-preview to preview the Open Graph meta data.

## Command

Replace **PORT** with the port number your local dev server is running on.

If your project **is** a Single Page Application, you must set the flag **--spa**.<br>

```sh
og-preview start -p PORT --spa
```

If your page **is not** a Single Page Application, you must set the flag **--nospa**.

```sh
og-preview start -p PORT --nospa
```

## Example

If your project is running on port 5173 and **is SPA**, use the following command:

```sh
og-preview start -p 5173 --spa
```

If your project is running on port 5173 and **is not SPA**, use the following command:

```sh
og-preview start -p 5173 --nospa
```

This will generate a preview of all available Open Graph meta data and open it in a new browser tab.

## Features

- **Easy to Use:** Simple CLI command to get a preview of all available Open Graph meta data.
- **Local Development:** Works with your local dev server, no need to deploy.
- **Quick Preview:** Instantly opens a new browser tab with the Open Graph preview.

## Example Workflow

1. Start your local development server: Ensure your project is running locally, e.g., http://localhost:5173.

2. Run og-preview: Execute the following command in your CLI:

```sh
og-preview start -p 5173 --spa
```

View the Preview: A new browser tab will open displaying the Open Graph meta data for your project.
