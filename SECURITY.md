# Security Guidelines

## Environment Variables

This project uses environment variables to manage sensitive configuration data like API keys and team IDs. **Never commit these values directly in code.**

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:
   ```bash
   CLICKUP_API_KEY=your_actual_api_key_here
   CLICKUP_TEAM_ID=your_actual_team_id_here
   ```

3. The `.env` file is already included in `.gitignore` and will never be committed.

### Running the Application

Use the provided script which safely loads environment variables:
```bash
./run.sh
```

Or export variables manually:
```bash
export CLICKUP_API_KEY=your_api_key
export CLICKUP_TEAM_ID=your_team_id
npm start
```

## Important Security Notes

- ✅ Use `.env` files for local development
- ✅ Use environment variables in production
- ✅ Keep `.env` in `.gitignore`
- ❌ Never commit API keys or secrets to Git
- ❌ Never hardcode credentials in scripts
- ❌ Never share `.env` files or credentials in public channels

## If You Accidentally Commit Secrets

If you accidentally commit API keys or other secrets:

1. **Immediately revoke/rotate** the compromised credentials
2. **Rewrite Git history** to remove the secrets
3. **Force push** to update remote repositories
4. **Update all deployment environments** with new credentials

Remember: Once pushed to a public repository, assume the secret is compromised permanently.
