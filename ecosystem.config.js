module.exports = {
    apps: [
      {
        name: 'Tung.Dev',
        port: '3232',
        exec_mode: 'cluster',
        instances: 'max',
        script: '.output/server/index.mjs',
        interpreter: 'node',
        interpreter_args: '--experimental-modules',
      }
    ]
  }