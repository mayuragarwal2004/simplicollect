import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppInstallBanner } from '../../hooks/useAppInstallBanner';
import { APP_CONFIG } from '../../config/appConfig';

const AppBannerDevTester: React.FC = () => {
  const appInstallBanner = useAppInstallBanner({
    appName: APP_CONFIG.appName,
    appStoreLinks: APP_CONFIG.storeLinks,
    showDelay: APP_CONFIG.installBanner.development.showDelay,
    hideAfterDays: APP_CONFIG.installBanner.hideAfterDays,
  });

  // Only show in development
  if (!(import.meta as any).env.DEV) {
    return null;
  }

  const devHelpers = (appInstallBanner as any).devHelpers;
  
  if (!devHelpers) {
    return (
      <Card className="m-4 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">🧪 App Banner Dev Tester</CardTitle>
          <CardDescription className="text-orange-600">
            Development helpers not available. Make sure you're in development mode.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const debugInfo = devHelpers.getDebugInfo();

  return (
    <Card className="m-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800">🧪 App Install Banner - Dev Tester</CardTitle>
        <CardDescription className="text-blue-600">
          Test the app install banner functionality in development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Current Status:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <Badge variant={debugInfo.showBanner ? "default" : "secondary"}>
              Banner: {debugInfo.showBanner ? 'Visible' : 'Hidden'}
            </Badge>
            <Badge variant={debugInfo.deviceInfo.isMobile ? "default" : "secondary"}>
              Mobile: {debugInfo.deviceInfo.isMobile ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={debugInfo.deviceInfo.isIOS ? "default" : "secondary"}>
              iOS: {debugInfo.deviceInfo.isIOS ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={debugInfo.deviceInfo.isAndroid ? "default" : "secondary"}>
              Android: {debugInfo.deviceInfo.isAndroid ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={debugInfo.deviceInfo.isInApp ? "destructive" : "default"}>
              In App: {debugInfo.deviceInfo.isInApp ? 'Yes' : 'No'}
            </Badge>
            <Badge variant={debugInfo.deviceInfo.isSimulated ? "outline" : "secondary"}>
              Simulated: {debugInfo.deviceInfo.isSimulated ? 'Yes' : 'No'}
            </Badge>
          </div>
          
          {/* Expected Store Display */}
          <div className="p-3 bg-gray-100 rounded-lg">
            <h5 className="font-medium text-sm mb-1">Expected Banner Behavior:</h5>
            <p className="text-xs text-gray-600">
              Store: <strong>{debugInfo.deviceInfo.isIOS ? 'App Store' : debugInfo.deviceInfo.isAndroid ? 'Google Play' : 'App Store (default)'}</strong>
              {debugInfo.deviceInfo.isSimulated && (
                <span className="ml-2 text-blue-600">[Simulated Device]</span>
              )}
            </p>
          </div>
        </div>

        {/* Device Simulation */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Device Simulation:</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => devHelpers.simulateDevice('ios')}
            >
              📱 Simulate iOS
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => devHelpers.simulateDevice('android')}
            >
              🤖 Simulate Android
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => devHelpers.simulateDevice('desktop')}
            >
              💻 Simulate Desktop
            </Button>
          </div>
        </div>

        {/* Banner Controls */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Banner Controls:</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              onClick={() => devHelpers.forceShow()}
            >
              🎯 Force Show Banner
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => appInstallBanner.dismissBanner()}
            >
              ❌ Dismiss Banner
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => appInstallBanner.resetBanner()}
            >
              🔄 Reset Banner State
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Debug Info:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {/* Configuration */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Quick Config Changes:</h4>
          <p className="text-sm text-gray-600 mb-2">
            To test different scenarios, modify these values in <code>appConfig.ts</code>:
          </p>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• <code>forceShow: true</code> - Always show banner</li>
            <li>• <code>simulateDevice: 'ios'</code> - Simulate iOS device</li>
            <li>• <code>testMode: true</code> - Mock download behavior</li>
            <li>• <code>showDelay: 1000</code> - Faster banner display</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppBannerDevTester;
