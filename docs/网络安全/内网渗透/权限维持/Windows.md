# Windows 权限维持

## 添加用户

管理员模式启动 powershell

```powershell
# 新建一个名为 NewAdminUser 的本地标准用户(普通用户,无管理员权限)，密码为 Password123!
New-LocalUser -Name "NewAdminUser" -Password (ConvertTo-SecureString "Password123!" -AsPlainText -Force) -FullName "New Admin User" -Description "New local admin account"
# 将用户添加到管理员组
Add-LocalGroupMember -Group "Administrators" -Member "NewAdminUser"
# 验证用户是否已被添加到管理员组
Get-LocalGroupMember -Group "Administrators"

# 删除用户
Remove-LocalUser -Name "NewAdminUser"
# 验证是否删除成功
Get-LocalUser
```

> 添加一个普通用户:
>
> ![image-20240918134940882](http://cdn.ayusummer233.top/DailyNotes/202409181356489.png)
>
> ---
>
> 添加一个管理员用户:
>
> ![image-20240918141158082](http://cdn.ayusummer233.top/DailyNotes/202409181412119.png)

添加远程访问权限:

![image-20240918135704959](http://cdn.ayusummer233.top/DailyNotes/202409181357858.png)

---



