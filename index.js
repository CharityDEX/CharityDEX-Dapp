const root = document.getElementById('walletConnectBlock');

if (root != null) {
  import('./src/index').then((module) => {
    module.main(root);
  });
}
