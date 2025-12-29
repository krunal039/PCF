# Quick Start Guide - Running the PCF Project

## Prerequisites Check

Before running the project, ensure you have:

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **PowerApps CLI** (pac CLI)
   ```bash
   pac --version
   ```
   If not installed:
   ```bash
   npm install -g @microsoft/powerapps-cli
   ```

## Step-by-Step Setup

### Step 1: Install Dependencies

Open a terminal in the project root directory and run:

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- PCF scripts
- TypeScript
- ESLint
- And other dependencies

### Step 2: Build the Project

Build the PCF controls:

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Bundle the code
- Generate output in the `out/` directory
- Create the PCF control package

**Note:** If you encounter build errors, check:
- All dependencies are installed (`npm install`)
- TypeScript version compatibility
- Node.js version (should be v14+)

### Step 3: Generate Type Definitions (First Time Only)

After building, generate TypeScript types from the control manifest:

```bash
npm run refreshTypes
```

This creates type definitions in `controls/PASDetailsPCF/generated/ManifestTypes.d.ts`

### Step 4: Start Development Server

Start the PCF test harness for local development:

```bash
npm start
```

This will:
- Start a local development server
- Open the PCF test harness in your browser
- Enable hot-reload for development
- Typically runs on `http://localhost:8181`

## Development Workflow

### During Development

1. **Make code changes** in `src/` or `controls/` directories
2. **Save files** - the build process will automatically recompile
3. **Refresh browser** - the test harness will reload with changes

### Common Commands

```bash
# Build the project
npm run build

# Start development server
npm start

# Generate type definitions
npm run refreshTypes

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run tests (if configured)
npm test
```

## Troubleshooting

### Build Errors

**Error: Cannot find module**
```bash
# Solution: Reinstall dependencies
npm install
```

**Error: TypeScript compilation errors**
```bash
# Check TypeScript version
npm list typescript

# Regenerate types
npm run refreshTypes
```

**Error: PCF scripts not found**
```bash
# Reinstall PCF scripts
npm install pcf-scripts pcf-start --save-dev
```

### Runtime Errors

**Test harness won't start**
- Check if port 8181 is available
- Try closing other applications using that port
- Check firewall settings

**Control not loading**
- Check browser console for errors
- Verify build completed successfully
- Check that all dependencies are installed

**Type errors**
- Run `npm run refreshTypes` after manifest changes
- Ensure `generated/ManifestTypes.d.ts` exists

## Project Structure for Running

```
PFCX/
├── controls/              # PCF control definitions
│   └── PASDetailsPCF/    # Your control
├── src/                   # Source code
├── out/                   # Build output (generated)
├── node_modules/          # Dependencies (generated)
├── package.json          # Project configuration
└── tsconfig.json         # TypeScript configuration
```

## Next Steps After Running

1. **Test the Control**: Use the test harness to test your control
2. **Configure Properties**: Test different property values
3. **Debug**: Use browser DevTools for debugging
4. **Deploy**: When ready, build and deploy to Power Apps

## Deployment

When you're ready to deploy:

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Create a solution** in Power Apps
3. **Add the PCF control** to the solution
4. **Export the solution** (managed or unmanaged)
5. **Import into target environment**

## Additional Resources

- [PCF Documentation](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview)
- [PCF Samples](https://github.com/microsoft/PowerApps-Samples)
- [PowerApps CLI Reference](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/powerapps-cli)

