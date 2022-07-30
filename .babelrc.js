module.exports = {
  plugins: [
    'lodash',
    [
      'import', {
        libraryName: 'antd',
        style: 'css',
      },
      'antd'
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          chrome: '100'
        },
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ]
}
