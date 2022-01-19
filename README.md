# 修改 APP 名称

IOS
编辑 ios/项目名/Info.plist
<key>CFBundleDisplayName</key>

- <string>$(PRODUCT_NAME)</string>

* <string>new product_name</string>
  android
  编辑 android/app/src/main/res/values/strings.xml
  <resources>

- <string name=“app_name">old product name</string>

* <string name="app_name">new product name</string>  
  </resources>

# 执行 npx pod-install ios
