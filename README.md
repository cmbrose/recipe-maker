# Recipe Maker

## Rotating secrets

### `AZURE_CREDENTIALS`

Run this command and paste the entire JSON output into the secret

```sh
az login --use-device-code --tenant 1de76197-8b2f-489c-9a59-d827ba35b2aa

az ad sp create-for-rbac --role contributor --name recipes-dev-aks --scopes /subscriptions/bb3afef1-e1ff-4b0e-a8e3-bd3a8e208b43/resourceGroups/recipes-svc-dev --sdk-auth
```