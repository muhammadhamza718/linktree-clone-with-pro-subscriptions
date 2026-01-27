'use client';

import { useState } from 'react';
import { isValidDomain } from '../../lib/utils';

interface DomainConnectWizardProps {
  profileId: string;
  onComplete: (domain: any) => void;
  onCancel: () => void;
}

export default function DomainConnectWizard({ profileId, onComplete, onCancel }: DomainConnectWizardProps) {
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationRecord, setVerificationRecord] = useState<{ name: string; value: string } | null>(null);

  const validateDomain = () => {
    if (!domain) {
      setErrors(['Domain is required']);
      return false;
    }

    if (!isValidDomain(domain)) {
      setErrors(['Please enter a valid domain (e.g., example.com)']);
      return false;
    }

    setErrors([]);
    return true;
  };

  const handleAddDomain = async () => {
    if (!validateDomain()) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          domain,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add domain');
      }

      // Move to verification step
      setVerificationRecord({
        name: '_linktree-verification',
        value: result.domain.verifyToken,
      });
      setStep(2);
      onComplete(result.domain);
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDomain = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch(`/api/domains/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainId: verificationRecord?.value, // This would be the actual domain ID
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStep(3); // Verification success step
      } else {
        throw new Error(result.message || 'Verification failed');
      }
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSSLSetup = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      // In a real implementation, this would trigger SSL certificate provisioning
      // For now, we'll simulate the process
      const response = await fetch(`/api/domains/ssl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onComplete(result.domain);
      } else {
        throw new Error(result.message || 'SSL setup failed');
      }
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {step === 1 && 'Add Custom Domain'}
          {step === 2 && 'Verify Domain Ownership'}
          {step === 3 && 'SSL Certificate Setup'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {errors.map((error, idx) => (
                  <span key={idx} className="block">
                    • {error}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <p className="text-gray-600">
              Connect your custom domain to your profile. This allows visitors to access your profile using your own domain instead of the default URL.
            </p>
          </div>

          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Your Domain
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="yourdomain.com"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter your custom domain (e.g., mybrand.com)
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddDomain}
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Continue to Verification'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="text-gray-600">
              To verify domain ownership, add the following DNS record to your domain provider's settings.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">DNS Verification Record</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Type</label>
                <div className="mt-1 text-sm font-mono">CNAME</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Name</label>
                <div className="mt-1 text-sm font-mono">{verificationRecord?.name}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500">Value</label>
                <div className="mt-1 text-sm font-mono">{verificationRecord?.value}</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Add this record to your domain provider's DNS settings. It may take up to 48 hours to propagate.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleVerifyDomain}
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Domain'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <p className="text-gray-600">
              Your domain has been verified! Now setting up SSL certificate for secure access.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">SSL Certificate</h3>
            <p className="mt-1 text-sm text-blue-700">
              SSL certificate will be automatically provisioned using Let's Encrypt. This ensures your custom domain is accessible via HTTPS.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSSLSetup}
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Setting up SSL...' : 'Complete Setup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}