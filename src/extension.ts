import * as vscode from "vscode";
import * as fs from "fs";
import { join } from "path";

export function activate(context: vscode.ExtensionContext) {
  const searchPaths = vscode.workspace
    .getConfiguration("codescript")
    .get("searchPaths") as string[];

  Object.assign(global, {
    c: {
      info: vscode.window.showInformationMessage,
      error: vscode.window.showErrorMessage,
      onFileOpened(
        callback: (d: vscode.TextDocument) => any,
        filetype?: string
      ) {
        vscode.workspace.onDidOpenTextDocument((d) => {
          if (!filetype || d.languageId === filetype) {
            callback(d);
          }
        });
      },
    },
  });

  searchPaths.forEach((p) => {
    fs.readdir(p, { withFileTypes: true }, (err, files) => {
      if (err !== null) {
        vscode.window.showErrorMessage(`Error loading script path: ${p}`);
        return;
      }

      files.forEach((file) => {
        if (file.isFile() && /\.js$/.test(file.name)) {
          import(join(p, file.name)).catch((e) => {
            console.log("error");
          });
        }
      });
    });
  });

  // let disposable = vscode.commands.registerCommand(
  //   "codescript.helloWorld",
  //   async () => {
  //     Object.assign(global, {
  //       c: {
  //         info: vscode.window.showInformationMessage,
  //       },
  //     });

  //     const script = "/Users/calebdenio/.config/codescript/index.js";

  //     await import(script);
  //   }
  // );

  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
