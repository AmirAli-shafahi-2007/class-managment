export default function StatCard({ title, value, icon }) {
  return (
    <div className="p-5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg 
                    flex items-center justify-between hover:bg-white/20 transition">

      <div>
        <p className="text-sm text-gray-200">{title}</p>
        <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
      </div>

      <div className="text-purple-300">
        {icon}
      </div>

    </div>
  );
}
