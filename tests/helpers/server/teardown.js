module.exports = async () => {
  console.log('\n[Start] Global teardown');
  await global.LOCAL_SERVER.stop();
  console.log('[Done] Global teardown');
};
