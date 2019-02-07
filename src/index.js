function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context('styles/', true));
requireAll(require.context('js/', true));
requireAll(require.context('images/', true));
