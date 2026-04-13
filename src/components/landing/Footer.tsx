import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const t = useTranslation()

  return (
    <footer className="border-t border-ace-border bg-ace-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold text-gray-100">{t('landing.footer.company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400">
                  {t('landing.footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400">
                  {t('landing.footer.blog')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-gray-100">{t('landing.footer.product')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400">
                  {t('landing.footer.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-sm text-gray-400 hover:text-emerald-400">
                  {t('nav.demo')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-gray-100">{t('landing.footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400">
                  {t('landing.footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400">
                  {t('landing.footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-gray-100">{t('landing.footer.contact')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                contact@acecourt.dk
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                +45 40 40 40 40
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                Copenhagen, Denmark
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ace-border pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 ACECOURT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
