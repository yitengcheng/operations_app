# 修改 APP 名称

IOS
编辑 ios/项目名/Info.plist
<key>CFBundleDisplayName</key>

- <string>$(PRODUCT_NAME)</string>

* <string>new product_name</string>
  android
  编辑 android/app/src/main/res/values/strings.xml
  <resources>

- <string name="app_name">old product name</string>

* <string name="app_name">new product name</string>  
  </resources>

# 执行 npx pod-install ios

# react-native-form-validator 插件

中文提示语：
在 src/messages/defaultMessages 中添加
`cn: { numbers: '"{0}"必须是数字.', email: '"{0}"必须是电子邮箱.', required: '"{0}"不能为空.', date: '"{0}"的格式必须是({1}).', minlength: '"{0}"长度不足{1}.', maxlength: '"{0}"长度超过{1}.', equalPassword: '两次输入密码不一致.', hasUpperCase: '"{0}"必须是大写.', hasLowerCase: '"{0}"必须是小写.', hasNumber: '"{0}"必须包含数字.', hasSpecialCharacter: '"{0}"必须包含特殊字符.', },`
将 src/messages/use-validation.js 中

- const deviceLocale = props.deviceLocale || 'en';

* const deviceLocale = props.deviceLocale || 'cn';
