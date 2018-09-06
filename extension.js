// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// eslint-disable-next-line
const vscode = require('vscode');
const Conf = require('conf');
const Geektime = require('geektime');

const config = new Conf();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-geektime" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('extension.login', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInputBox({
      placeHolder: '135********',
      prompt: '请输入手机号码',
    }).then((phone) => {
      if (!phone) return;

      config.set('phone', phone);

      vscode.window.showInputBox({
        placeHolder: '********',
        password: true,
        prompt: '请输入密码',
      }).then((password) => {
        if (!password) return;

        config.set('password', password);
      });
    });
  });

  context.subscriptions.push(disposable);

  const products = vscode.commands.registerCommand('extension.products', async () => {
    const phone = config.get('phone');
    const password = config.get('password');
    const client = new Geektime(phone, password);
    const r = await client.products();

    const strs = [];

    r.forEach((v) => {
      strs.push(`#${v.id} ${v.title} (${v.list.length})`);
      strs.push('--------------');

      v.list.forEach((column) => {
        const { author_name: author, column_id: cid } = column.extra;
        strs.push(`  ${cid}: ${column.title} (by ${author})`);
      });
    });

    vscode.window.showInformationMessage(strs.join('\n'));
  });

  context.subscriptions.push(products);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
