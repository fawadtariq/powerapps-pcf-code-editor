# HOWTOGUIDE — Build & Deploy the PCF Code Editor Solution (Monaco)

This guide describes the **repeatable** workflow to:
1) install dependencies  
2) authenticate to a Power Apps environment  
3) build the PCF control  
4) **package** the solution using **MSBuild** (so it includes the PCF)  
5) import the solution into Dataverse / Dynamics 365 Model‑Driven Apps

>
> - `/src/` → PCF project (`src.pcfproj`, `package.json`, etc.)
> - `/solution/` → Solution project (`solution.cdsproj`, `src/`, `bin/`, etc.)

---

## 0) Prerequisites

Install the following on your dev machine:

- **Node.js LTS** (recommended)
- **Power Platform CLI (PAC)** (`pac`)
- **Visual Studio Build Tools** (or Visual Studio) including:
  - **MSBuild**
  - **.NET Framework 4.6.2 targeting pack** (required by `.cdsproj`)
- Recommended: **Git** + a terminal

---

## 1) Install dependencies

From the PCF project folder:

```cmd
cd <repo-root>\src
npm ci
# or if you don't have a lockfile:
# npm install
```

---

## 2) Authenticate to the target environment (pac auth create)

> You must authenticate **before** importing solutions via CLI.

### Create an auth profile

```cmd
pac auth create <your-environment-URL>
```

Follow the interactive prompts:
- Choose **Cloud** (Public)
- Enter your **Environment URL** (e.g. `https://<org>.crm4.dynamics.com`)
- Sign in and complete MFA

### Verify / select active profile

```cmd
pac auth list
pac auth select --index <N>
```

Optional sanity check:

```powershell
pac org who
```

---

## 3) Build the control (PCF)

> Build the PCF first so the solution packaging step can pull in the compiled control artifacts.

From the PCF project folder:

```cmd
cd <repo-root>\src
pac pcf build --buildMode production
```

Expected output:
- Built artifacts under:
  - `<repo-root>\src\out\controls\<ControlName>\...`

> Tip: `pac pcf push` always builds in *development* mode and can exceed webresource limits for large bundles.
> For deployment, prefer the **production build + MSBuild pack** workflow in this guide.

---

## 4) Pack the solution using MSBuild (includes the PCF)

This is the crucial step: **MSBuild** reads `solution.cdsproj` and uses the project reference to include your PCF control into the solution package.

From the solution project folder:

```cmd
cd <repo-root>\solution
msbuild solution.cdsproj /t:Restore,Build /p:Configuration=Release
```

### Where the ZIP is produced

After a successful build, check:

- `<repo-root>\solution\bin\Release\`

You should find a solution ZIP there (name can vary by configuration), for example:

- `CodeEditorSolution.zip` (or similar)

**Quick validation:** the ZIP should be noticeably larger than a “shell” solution and contain more than just `solution.xml/customizations.xml`.

---

## 5) Import the solution

### Option A — Import via Power Apps UI (most common)

1. Go to **Power Apps** → **Solutions**
2. **Import** → select the ZIP from:
   - `<repo-root>\solution\bin\Release\...zip`
3. Complete the import wizard

### Option B — Import via CLI

From anywhere:

```powershell
pac solution import --path "<repo-root>\solution\bin\Release\<YourSolutionZip>.zip"
```

Confirm import status in:
- Power Apps → Solutions → your solution → verify the PCF component exists

---

## Troubleshooting

### “Solution imported but empty”
This happens when you packed a folder that didn’t contain built components (a shell solution).
✅ Fix: **Build the `.cdsproj` with MSBuild** and import the ZIP from `bin/Release`.

### “Webresource content size is too big”
- Ensure you deploy the **production** build via MSBuild packaging (this guide).
- If still too large, reduce Monaco payload (avoid TypeScript services) or increase the environment’s max webresource/attachment size.

---

## Suggested repeatable deployment flow

```text
(once)        npm ci
(each deploy)  pac auth select
(each deploy)  pac pcf build --buildMode production
(each deploy)  msbuild solution.cdsproj /t:Restore,Build /p:Configuration=Release
(each deploy)  import ZIP from solution/bin/Release
```
