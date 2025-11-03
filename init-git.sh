#!/bin/bash

# Initialize Git Repository for Dabira Foods
# This script helps you prepare your project for GitHub deployment

echo "🚀 Initializing Git Repository for Dabira Foods"
echo ""

# Check if git is initialized
if [ -d .git ]; then
    echo "✅ Git repository already initialized"
else
    echo "📦 Initializing new Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

echo ""
echo "📝 Adding all files to Git..."
git add .

echo ""
echo "📋 Current status:"
git status --short

echo ""
echo "✅ Ready to commit!"
echo ""
echo "Next steps:"
echo "1. Review the changes above"
echo "2. Commit: git commit -m 'Initial commit - Dabira Foods Delivery App'"
echo "3. Create a repository on GitHub"
echo "4. Connect: git remote add origin https://github.com/YOUR_USERNAME/dabira-foods.git"
echo "5. Push: git branch -M main && git push -u origin main"
echo ""
echo "📖 For deployment instructions, see DEPLOYMENT.md"

