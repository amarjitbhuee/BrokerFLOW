
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MoreVertical, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Camera, 
  DollarSign, 
  Calendar, 
  User, 
  Phone,
  Edit2
} from 'lucide-react';
import { Profile, Listing, ListingType } from '../types.ts';

interface ListingsProps {
  user: Profile;
  listings: Listing[];
  onConvertToPending: (listing: Listing) => string;
  onAddListing: (listingData: Partial<Listing>) => void;
  onUpdateListing: (id: string, updatedData: Partial<Listing>) => void;
}

const Listings: React.FC<ListingsProps> = ({ user, listings, onConvertToPending, onAddListing, onUpdateListing }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormData = {
    address: '',
    property_type: 'Single Family',
    listing_type: 'SALE' as ListingType,
    price: '',
    listing_date: '',
    expiration_date: '',
    seller_name: '',
    seller_contact: '',
    image_url: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (listing: Listing) => {
    setEditingId(listing.id);
    setFormData({
      address: listing.address,
      property_type: listing.property_type,
      listing_type: listing.listing_type,
      price: listing.price?.toString() || '',
      listing_date: listing.listing_date || '',
      expiration_date: listing.expiration_date || '',
      seller_name: listing.seller_name || '',
      seller_contact: listing.seller_contact || '',
      image_url: listing.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleConversion = (listing: Listing) => {
    if (listing.status === 'PENDING') {
      alert("This listing is already in escrow.");
      return;
    }
    
    const confirmConversion = window.confirm(`Ready to open escrow for ${listing.address}? This listing will be moved to Pendings.`);
    if (confirmConversion) {
      const newPendingId = onConvertToPending(listing);
      navigate(`/pendings/${newPendingId}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address.trim()) return;
    
    const finalData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined
    };

    if (editingId) {
      onUpdateListing(editingId, finalData);
    } else {
      onAddListing(finalData);
    }

    setFormData(initialFormData);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Listings</h2>
          <p className="text-slate-500">Manage your current listing inventory.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Listing
        </button>
      </div>

      {/* Add/Edit Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Listing Details' : 'New Listing Details'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* Image Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    formData.image_url ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {formData.image_url ? (
                    <>
                      <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold flex items-center gap-2"><Camera className="h-5 w-5" /> Change Photo</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-500">Property Photo (Optional)</p>
                      <p className="text-xs text-slate-400">Click to upload image</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Property Address</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 123 Maple Avenue, San Francisco, CA"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Property Type</label>
                    <select 
                      value={formData.property_type}
                      onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                    >
                      <option>Single Family</option>
                      <option>Condo</option>
                      <option>Townhouse</option>
                      <option>Multi-Family</option>
                      <option>Commercial</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Listing Type</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      {(['SALE', 'LEASE'] as ListingType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, listing_type: type})}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            formData.listing_type === type 
                              ? 'bg-white text-indigo-600 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Listing Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="number" 
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Listing Date</label>
                    <input 
                      type="date" 
                      value={formData.listing_date}
                      onChange={(e) => setFormData({...formData, listing_date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Expiration Date</label>
                    <input 
                      type="date" 
                      value={formData.expiration_date}
                      onChange={(e) => setFormData({...formData, expiration_date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Seller Name</label>
                    <input 
                      type="text" 
                      placeholder="Seller Name"
                      value={formData.seller_name}
                      onChange={(e) => setFormData({...formData, seller_name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Seller Contact Info</label>
                    <input 
                      type="text" 
                      placeholder="Email or Phone"
                      value={formData.seller_contact}
                      onChange={(e) => setFormData({...formData, seller_contact: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    {editingId ? 'Save Changes' : 'Create Listing'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="h-44 bg-slate-100 flex items-center justify-center relative overflow-hidden">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.address} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Home className="h-12 w-12 text-slate-300 group-hover:text-slate-400" />
              )}
              
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded shadow-sm uppercase ${
                  listing.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {listing.status}
                </span>
                <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded shadow-sm uppercase bg-white/90 text-slate-800 backdrop-blur-md">
                  {listing.listing_type}
                </span>
              </div>
              
              {listing.price && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded font-black text-sm">
                  {currencyFormatter.format(listing.price)}
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(listing)}
                  className="p-1.5 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-indigo-600 shadow-sm"
                  title="Edit Listing"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-1.5 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-slate-600 shadow-sm">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 truncate" title={listing.address}>{listing.address}</h3>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                <Home className="h-3 w-3" /> {listing.property_type}
              </p>
              
              <div className="grid grid-cols-2 gap-y-3 mb-5 border-t border-slate-50 pt-4">
                {listing.listing_date && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Listed</span>
                    <span className="text-xs font-semibold text-slate-700">{listing.listing_date}</span>
                  </div>
                )}
                {listing.expiration_date && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Expires</span>
                    <span className="text-xs font-semibold text-slate-700">{listing.expiration_date}</span>
                  </div>
                )}
                {listing.seller_name && (
                  <div className="flex flex-col col-span-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Seller</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{listing.seller_name}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleConversion(listing)}
                disabled={listing.status === 'PENDING'}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-bold text-sm transition-all ${
                  listing.status === 'PENDING'
                    ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                    : 'border-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm'
                }`}
              >
                {listing.status === 'PENDING' ? (
                  <><CheckCircle2 className="h-4 w-4" /> In Escrow</>
                ) : (
                  <>Convert to Pending <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        ))}

        {listings.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">No active listings yet</p>
            <p className="text-sm text-slate-400 mb-6">Start by adding your first property listing.</p>
            <button 
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add My First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
