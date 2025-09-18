import cron from 'node-cron'

// Momento que e perciso fazer uma transação no banco passa por esse serviço

// SERVIÇO DE NOTIFICAÇÃO PARA ALERTA QUANDO TEM LOCAÇÃO PENDENTE A MAIS DE 1 HORA
export async function notificationTheLocationPendiente(io , pool){
    cron.schedule("0 * * * *", async () => {
        console.log("⏰ Verificando locações pendentes há > 1h...");
    
    const query = `
          SELECT DISTINCT 
        b.beloidcl   AS clloid,
       c.cllonmlo   AS numerolocacao,
       TO_CHAR(MIN(c.cllohrat) , 'HH24:MI:SS') AS primeiroinicio
       FROM bensloc b
       JOIN clieloc c ON c.clloid = b.beloidcl
       WHERE b.belostat = 'Pendente'
       AND b.belodtin <= NOW() - INTERVAL '1 hour'
       AND c.cllodtlo = CURRENT_DATE
       GROUP BY b.beloidcl, c.cllonmlo

        `;
    
        try {
          const { rows } = await pool.query(query);
    
          if (rows.length > 0) {
            for (const loc of rows) {
              // envia para todos os clientes conectados
                console.log("Dados recebidos do banco:", loc);
              io.emit("locacaoPendenteHaMaisDe1h", {
                clloid: loc.clloid,
                numero: loc.numerolocacao,
                desde: loc.primeiroinicio
              });
              console.log(`⚠️ Locação ${loc.numerolocacao} pendente há mais de 1h`);
            }
          } else {
            console.log("✅ Nenhuma locação pendente há > 1h");
          }
        } catch (err) {
          console.error("Erro ao verificar locações pendentes:", err);
        }
      });
}