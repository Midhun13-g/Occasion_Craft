interface BirthdayTemplateProps {
  data: Record<string, unknown>;
}

export default function BirthdayTemplate({ data }: BirthdayTemplateProps) {
  const {
    name = 'Friend',
    age = '25',
    message = 'Wishing you a wonderful birthday!',
    primaryColor = '#FF6B9D',
    secondaryColor = '#FFC93C',
    imageUrl = 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg'
  } = data;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      }}
    >
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative h-64">
          <img
            src={imageUrl as string}
            alt="Birthday celebration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-5xl font-bold mb-2">Happy Birthday!</h1>
            <p className="text-2xl font-semibold">{name as string}</p>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="inline-block mb-6">
            <div
              className="text-7xl font-bold text-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: primaryColor as string }}
            >
              {age as string}
            </div>
          </div>

          <p className="text-xl text-slate-700 leading-relaxed mb-8">
            {message as string}
          </p>

          <div className="flex justify-center gap-4 text-4xl">
            🎉 🎂 🎈 🎁 ✨
          </div>
        </div>

        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
          }}
        ></div>
      </div>
    </div>
  );
}
