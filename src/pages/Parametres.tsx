import { AppLayout } from "@/components/AppLayout";

const Parametres = () => {
  return (
    <AppLayout title="Paramètres">
      <h1 className="md:hidden text-xl font-heading font-bold text-foreground mb-4">Paramètres</h1>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">Les paramètres seront disponibles dans une prochaine version.</p>
      </div>
    </AppLayout>
  );
};

export default Parametres;
