import { client } from '../database/userDataBase.js';
const dataClient = client;

export const autoRegister = {

    registerAuto: async (data) => {
        const {
            caaucode, caauplac, caauchss, caaurena, caaumaca,
            caaumode, caaucor, caautico, caaukmat, caaumoto,
            cadstat, caddtcad
        } = data;

        const insert = `INSERT INTO cadauto (caaucode, caauplac, caauchss, caaurena, caaumaca,
                                            caaumode, caaucor, caautico, caaukmat, caaumoto,
                                            cadstat, caddtcad) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
        
        const values = [caaucode, caauplac, caauchss, caaurena, caaumaca, caaumode,
                        caaucor, caautico, caaukmat, caaumoto, cadstat, caddtcad];

        const result = await dataClient.query(insert, values);
        return result.rows[0];
    },

    listAutos: async () => {
        try {
            const query = 'SELECT * FROM cadauto';
            const result = await dataClient.query(query);
            return result.rows;
        } catch (error) {
            console.error('Erro ao listar autos:', error.message);
        }
    },

    deleteAuto: async (id) => {
        try {
            const deleteQuery = 'DELETE FROM cadauto WHERE caaucode = $1 RETURNING *';
            const result = await dataClient.query(deleteQuery, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao deletar auto:', error.message);
        }
    },

    updateAuto: async (id, updateData) => {
        try {
            const query = `UPDATE cadauto SET caauplac = $1, caauchss = $2, caaurena = $3, 
                           caaumaca = $4, caaumode = $5, caaucor = $6, caautico = $7, 
                           caaukmat = $8, caaumoto = $9, cadstat = $10, caddtcad = $11
                           WHERE caaucode = $12 RETURNING *;`;
            
            const values = [
                updateData.caauplac || null, updateData.caauchss || null,
                updateData.caaurena || null, updateData.caaumaca || null,
                updateData.caaumode || null, updateData.caaucor || null,
                updateData.caautico || null, updateData.caaukmat || null,
                updateData.caaumoto || null, updateData.cadstat || null,
                updateData.caddtcad || null, id
            ];

            const result = await dataClient.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar auto:', error.message);
        }
    }
};
