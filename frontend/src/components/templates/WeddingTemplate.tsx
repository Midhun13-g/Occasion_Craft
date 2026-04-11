interface WeddingTemplateProps {
  data: Record<string, unknown>;
}

export default function WeddingTemplate({ data }: WeddingTemplateProps) {
  const {
    bride = 'Bride',
    groom = 'Groom',
    date = '2026-12-31',
    venue = 'Beautiful Venue',
    message = 'Join us as we celebrate our special day',
    imageUrl = 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg'
  } = data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative h-80">
          <img
            src={imageUrl as string}
            alt="Wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        <div className="relative -mt-20 px-8 pb-8">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center border-t-4 border-rose-400">
            <div className="mb-6">
              <div className="inline-block text-6xl mb-4">💍</div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                {bride as string} & {groom as string}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            <p className="text-lg text-slate-600 mb-6 italic leading-relaxed">
              {message as string}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-3 text-slate-700">
                <span className="text-2xl">📅</span>
                <span className="font-semibold">{formatDate(date as string)}</span>
              </div>

              <div className="flex items-center justify-center gap-3 text-slate-700">
                <span className="text-2xl">📍</span>
                <span className="font-semibold">{venue as string}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-500 mb-4">We look forward to celebrating with you!</p>
              <div className="flex justify-center gap-3 text-3xl">
                💐 💒 🥂 🎊
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
