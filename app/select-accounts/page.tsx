'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search } from 'lucide-react'

interface AdAccount {
  id: string
  name: string
  currency: string
  account_status: number
}

export default function SelectAccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<AdAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingAccounts()
  }, [])

  const fetchPendingAccounts = async () => {
    try {
      const response = await fetch('/api/meta/pending-accounts')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch accounts')
      }
      const data = await response.json()
      setAccounts(data.accounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts')
      setTimeout(() => {
        router.push('/onboarding?error=Session expired. Please reconnect your Meta account.')
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAccount = (accountId: string) => {
    const newSelected = new Set(selectedAccounts)
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId)
    } else {
      newSelected.add(accountId)
    }
    setSelectedAccounts(newSelected)
  }

  const handleSaveAccounts = async () => {
    if (selectedAccounts.size === 0) {
      setError('Please select at least one account')
      return
    }

    setSaving(true)
    setError(null)

    try {
      console.log('Saving accounts:', Array.from(selectedAccounts))
      const response = await fetch('/api/meta/save-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountIds: Array.from(selectedAccounts)
        })
      })

      console.log('Save response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('Save error:', error)
        throw new Error(error.error || 'Failed to save accounts')
      }

      const result = await response.json()
      console.log('Save result:', result)

      router.push('/dashboard')
    } catch (err) {
      console.error('Error in handleSaveAccounts:', err)
      setError(err instanceof Error ? err.message : 'Failed to save accounts')
      setSaving(false)
    }
  }

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.id.includes(searchQuery)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Meta Ad Accounts</h1>
          <p className="text-gray-600">Choose which ad accounts you want to connect to FunnelPulse</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Available Accounts ({filteredAccounts.length})</CardTitle>
            <CardDescription>
              {selectedAccounts.size > 0
                ? `${selectedAccounts.size} account${selectedAccounts.size > 1 ? 's' : ''} selected`
                : 'Select at least one account to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Account ID or Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Account List */}
            <div className="border rounded-lg divide-y max-h-[500px] overflow-y-auto">
              {filteredAccounts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No accounts found matching "{searchQuery}"
                </div>
              ) : (
                filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleToggleAccount(account.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedAccounts.has(account.id)}
                        onCheckedChange={() => handleToggleAccount(account.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{account.name}</p>
                            <p className="text-sm text-gray-500 font-mono">{account.id}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm text-gray-600">{account.currency}</p>
                            {account.account_status === 1 ? (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                                Active
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push('/onboarding')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAccounts}
                disabled={selectedAccounts.size === 0 || saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect {selectedAccounts.size > 0 && `(${selectedAccounts.size})`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
