import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { usePlatformSettings } from '../../hooks/useFirestore'
import { useAuth } from '../../contexts/AuthContext'
import { savePlatformSettings } from '../../services/adminService'
import AdminPageHeader from '../../components/admin/AdminComponents'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'

const defaultForm = {
  websiteName: '',
  logo: '',
  favicon: '',
  contactEmail: '',
  phone: '',
  socialFacebook: '',
  socialTwitter: '',
  socialInstagram: '',
  socialLinkedin: '',
  seoTitle: '',
  seoDescription: '',
  terms: '',
  privacy: '',
}

export default function AdminSettings() {
  const { user, profile } = useAuth()
  const { data: settings, loading } = usePlatformSettings()
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  const admin = user
    ? { uid: user.uid, email: user.email, displayName: profile?.fullName || user.displayName, fullName: profile?.fullName }
    : null

  useEffect(() => {
    if (settings) {
      setForm({
        websiteName: settings.websiteName || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        contactEmail: settings.contactEmail || '',
        phone: settings.phone || '',
        socialFacebook: settings.socialFacebook || settings.social?.facebook || '',
        socialTwitter: settings.socialTwitter || settings.social?.twitter || '',
        socialInstagram: settings.socialInstagram || settings.social?.instagram || '',
        socialLinkedin: settings.socialLinkedin || settings.social?.linkedin || '',
        seoTitle: settings.seoTitle || '',
        seoDescription: settings.seoDescription || '',
        terms: settings.terms || '',
        privacy: settings.privacy || '',
      })
    }
  }, [settings])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await savePlatformSettings(
        {
          ...form,
          social: {
            facebook: form.socialFacebook,
            twitter: form.socialTwitter,
            instagram: form.socialInstagram,
            linkedin: form.socialLinkedin,
          },
        },
        admin
      )
      toast.success('Platform settings saved')
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader subtitle={loading ? 'Loading settings…' : 'Website branding, contact, SEO, and legal pages'} />

      <Card className="!p-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Website Name" value={form.websiteName} onChange={set('websiteName')} />
          <Input label="Logo URL" value={form.logo} onChange={set('logo')} placeholder="https://…" />
          <Input label="Favicon URL" value={form.favicon} onChange={set('favicon')} placeholder="https://…" />
          <Input label="Contact Email" type="email" value={form.contactEmail} onChange={set('contactEmail')} />
          <Input label="Phone" value={form.phone} onChange={set('phone')} />

          <p className="pt-2 text-sm font-semibold text-gray-700">Social Links</p>
          <Input label="Facebook" value={form.socialFacebook} onChange={set('socialFacebook')} />
          <Input label="Twitter / X" value={form.socialTwitter} onChange={set('socialTwitter')} />
          <Input label="Instagram" value={form.socialInstagram} onChange={set('socialInstagram')} />
          <Input label="LinkedIn" value={form.socialLinkedin} onChange={set('socialLinkedin')} />

          <Input label="SEO Title" value={form.seoTitle} onChange={set('seoTitle')} />
          <Textarea label="SEO Description" rows={2} value={form.seoDescription} onChange={set('seoDescription')} />
          <Textarea label="Terms of Service" rows={6} value={form.terms} onChange={set('terms')} />
          <Textarea label="Privacy Policy" rows={6} value={form.privacy} onChange={set('privacy')} />

          <Button type="submit" loading={saving || loading} className="w-full">
            Save Platform Settings
          </Button>
        </form>
      </Card>
    </div>
  )
}
