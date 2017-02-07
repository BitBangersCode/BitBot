# BitBot
A Discord Bot

Requires a config.json:

```
{
  "token" : "TOKEN",
  "prefix" : "!",
  "deathRole" : "role",
  "modrole":  "role",
  "adminrole" : "role",
  "ownerid" : "ownerid"
}
```
Create the adminrole, modrole on your server. This is required when using commands as they require different permission levels.
Ownerid is the ID of the owner of the server. This is also used for some commands that require certain permissions.
Create the deathRole from the config file on your server. This role will need to be placed above any role that you want to be affected by death.
To make this more interesting you can limit the deathRole to a certain channel such as a hell channel.

Requires a stats.json:

```
{

}
```
