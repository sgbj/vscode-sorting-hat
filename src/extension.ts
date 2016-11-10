'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let sorters = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-sorting-hat" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sortingHat', () => {
        
        // The code you place here will be executed every time your command is executed
        let activeTextEditor = vscode.window.activeTextEditor;

        if (!activeTextEditor) {
            vscode.window.showErrorMessage('A file must be open in order to use this extension.');
            return;
        }

        let fileName = vscode.window.activeTextEditor.document.fileName;
        let sorter = sorters.find(s => s.pattern.test(fileName));

        if (!sorter) {
            vscode.window.showQuickPick(sorters.map(s => s.name), {
                placeHolder: 'What do you want me to do?'
            }).then(result => {
                if (!result) {
                    return;
                }

                let sorter = sorters.find(s => s.name == result);
                sorter.sort();
            });
        } else {
            sorter.sort();
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

sorters.push({
    name: 'package.json',
    pattern: /package.json$/i,
    sort: () => {
        let doc = vscode.window.activeTextEditor.document;
        let text = vscode.window.activeTextEditor.document.getText();
        let obj = JSON.parse(text);
        let newObj = sortObject(obj);
        let newText = JSON.stringify(newObj, null, '  ');
        vscode.window.activeTextEditor.edit(builder => builder.replace(
            new vscode.Range(
                doc.lineAt(0).range.start,
                doc.lineAt(doc.lineCount - 1).range.end
            ), 
            newText
        ));
    }
});

sorters.push({
    name: 'bower.json',
    pattern: /bower.json$/i,
    sort: () => {
        let doc = vscode.window.activeTextEditor.document;
        let text = vscode.window.activeTextEditor.document.getText();
        let obj = JSON.parse(text);
        let newObj = sortObject(obj);
        let newText = JSON.stringify(newObj, null, '  ');
        vscode.window.activeTextEditor.edit(builder => builder.replace(
            new vscode.Range(
                doc.lineAt(0).range.start,
                doc.lineAt(doc.lineCount - 1).range.end
            ), 
            newText
        ));
    }
});

sorters.push({
    name: 'TypeScript imports',
    pattern: /\.ts$/i,
    sort: () => {
        vscode.window.showWarningMessage('Sorry! This feature isn\'t implemented yet.');
    }
});

function sortObject(obj) {
    let newObj = { };

    let keys = Object.keys(obj);
    keys.sort();

    keys.forEach(k => {
        newObj[k] = obj[k] instanceof Object && !(obj[k] instanceof Array) ? sortObject(obj[k]) : obj[k];
    });

    return newObj;
}
