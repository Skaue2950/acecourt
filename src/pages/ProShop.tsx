import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { getProShopItems, purchaseItem } from '@/lib/supabase'
import { useTranslation } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBag, Zap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProShop() {
  const t = useTranslation()
  const { user, profile } = useAuth()
  const queryClient = useQueryClient()
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const { data: items, isLoading } = useQuery({
    queryKey: ['pro-shop-items'],
    queryFn: async () => {
      try {
        return await getProShopItems()
      } catch {
        return []
      }
    },
  })

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      setPurchasingId(itemId)
      return await purchaseItem(itemId, user?.id as string)
    },
    onSuccess: () => {
      setPurchasingId(null)
      queryClient.invalidateQueries({ queryKey: ['pro-shop-items'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (error) => {
      console.error('Purchase failed:', error)
      setPurchasingId(null)
    },
  })

  const rarityConfig = {
    common: { bg: 'from-gray-700 to-gray-800', text: 'text-gray-300', border: 'border-gray-700' },
    rare: { bg: 'from-blue-600 to-blue-700', text: 'text-blue-300', border: 'border-blue-600/50' },
    epic: { bg: 'from-purple-600 to-purple-700', text: 'text-purple-300', border: 'border-purple-600/50' },
    legendary: {
      bg: 'from-yellow-500 to-orange-600',
      text: 'text-yellow-100',
      border: 'border-yellow-600/50 shadow-lg shadow-yellow-900/20',
    },
  }

  const getRarityBadge = (rarity: string) => {
    const rarities = {
      common: 'Almindelig',
      rare: 'Sjælden',
      epic: 'Episk',
      legendary: 'Legendarisk',
    }
    return rarities[rarity as keyof typeof rarities] || rarity
  }

  const filteredItems =
    filterCategory === 'all'
      ? items
      : items?.filter((item) => item.category === filterCategory)

  const categories = [
    { id: 'all', label: 'Alle' },
    { id: 'cosmetics', label: 'Kosmetik' },
    { id: 'equipment', label: 'Udstyr' },
    { id: 'accessories', label: 'Tilbehør' },
  ]

  return (
    <AppLayout className="p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {t('nav.proShop')}
          </h1>
          <p className="text-gray-400">Forbedre dit outfit og din profil</p>
        </div>

        {/* AceCoin Balance */}
        <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/30 border border-amber-800/30 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-400/70 uppercase tracking-wider font-medium mb-2">
                Din balance
              </p>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">
                {profile?.ace_coins || 0}
              </p>
              <p className="text-xs text-amber-400/50 mt-1">AceCoins</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-4xl">
              🪙
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all shrink-0',
                filterCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => {
              const config = rarityConfig[item.rarity as keyof typeof rarityConfig] || rarityConfig.common
              const canAfford = (profile?.ace_coins || 0) >= item.price
              const isPurchased = item.purchased

              return (
                <Card
                  key={item.id}
                  className={cn(
                    'relative overflow-hidden transition-all cursor-pointer hover:scale-105 active:scale-95',
                    `bg-gradient-to-br ${config.bg} border ${config.border}`,
                    !canAfford && !isPurchased && 'opacity-60'
                  )}
                >
                  {/* Item Icon */}
                  <div className="aspect-square bg-black/20 flex items-center justify-center text-4xl sm:text-5xl relative">
                    <span>{item.icon || '🎾'}</span>
                    {isPurchased && (
                      <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                        <span className="text-3xl">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2 min-h-0">
                      <h3 className="font-bold text-white text-sm line-clamp-2">{item.name}</h3>
                    </div>

                    {/* Rarity Badge */}
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          'text-xs',
                          item.rarity === 'legendary' && 'animate-pulse'
                        )}
                        variant="outline"
                      >
                        {getRarityBadge(item.rarity)}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1 pt-1 border-t border-white/10">
                      <span className="text-lg">🪙</span>
                      <span className={cn(
                        'font-black text-sm',
                        config.text
                      )}>
                        {item.price}
                      </span>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={() => {
                        if (!isPurchased && canAfford) {
                          purchaseMutation.mutate(item.id)
                        }
                      }}
                      disabled={!canAfford || isPurchased || purchasingId === item.id}
                      className={cn(
                        'w-full h-9 text-xs font-bold rounded-lg transition-all',
                        isPurchased
                          ? 'bg-emerald-600/30 text-emerald-300 cursor-not-allowed'
                          : canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      )}
                    >
                      {isPurchased ? 'Ejet' : purchasingId === item.id ? 'Køber...' : 'Køb'}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Ingen items tilgængelig</p>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
