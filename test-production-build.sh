#!/bin/bash

echo "🚀 Testing Production Build for Demo Pages..."
echo "==========================================="

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Check if demo files are properly generated
    echo "🔍 Checking demo build output..."
    
    if [ -d "dist" ]; then
        echo "✅ Dist folder exists"
        
        # Check for demo pages
        if [ -f "dist/Demos/LinkTree/index.html" ]; then
            echo "✅ LinkTree demo built successfully"
        else
            echo "❌ LinkTree demo missing"
        fi
        
        if [ -f "dist/Demos/Wedding/index.html" ]; then
            echo "✅ Wedding demo built successfully"
        else
            echo "❌ Wedding demo missing"
        fi
        
        # Check for problematic JS files
        echo ""
        echo "🔍 Checking for problematic JavaScript modules..."
        
        problematic_files=$(find dist -name "*DemoLayout*" -name "*.js" 2>/dev/null)
        
        if [ -z "$problematic_files" ]; then
            echo "✅ No problematic DemoLayout JavaScript modules found"
        else
            echo "⚠️  Found potentially problematic files:"
            echo "$problematic_files"
        fi
        
        echo ""
        echo "📊 Build summary:"
        echo "- Total files in dist: $(find dist -type f | wc -l)"
        echo "- HTML files: $(find dist -name "*.html" | wc -l)"
        echo "- JS files: $(find dist -name "*.js" | wc -l)"
        echo "- CSS files: $(find dist -name "*.css" | wc -l)"
        
    else
        echo "❌ Dist folder not found"
        exit 1
    fi
    
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎉 Build test completed!"
echo "If no errors above, your demo pages should work in production."
