import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useUserAddresses } from '../../hooks/useFirestore'
import { addAddress, deleteAddress } from '../../services/firestoreService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

export default function Addresses() {
  const { user } = useAuth()
  const { data: addresses } = useUserAddresses(user?.uid)
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async (id) => {
    if (!user) return
    await deleteAddress(user.uid, id)
    toast.success('Address deleted')
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((addr) => (
          <Card key={addr.id} className="!p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span className="font-bold text-gray-900">{addr.label}</span>
                {addr.isDefault && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              {addr.fullName}<br />
              {addr.address}<br />
              {addr.city}, {addr.state} {addr.pincode}<br />
              <span className="font-medium text-gray-800">{addr.phone}</span>
            </p>
          </Card>
        ))}
        {addresses.length === 0 && (
          <Card className="col-span-full py-12 text-center text-gray-500">
            No saved addresses yet. Add your first delivery address.
          </Card>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Address">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!user) return
            const form = e.target
            await addAddress(user.uid, {
              label: form.label.value,
              fullName: form.fullName.value,
              phone: form.phone.value,
              address: form.address.value,
              city: form.city.value,
              state: form.state.value || '',
              pincode: form.pincode.value,
              isDefault: addresses.length === 0,
            })
            toast.success('Address saved')
            setShowModal(false)
          }}
        >
          <Input label="Label" name="label" placeholder="Home, Work..." required />
          <Input label="Full Name" name="fullName" required />
          <Input label="Phone" name="phone" required />
          <Input label="Address" name="address" required />
          <Input label="City" name="city" required />
          <Input label="Pincode" name="pincode" required />
          <Button type="submit" size="full">Save Address</Button>
        </form>
      </Modal>
    </div>
  )
}
