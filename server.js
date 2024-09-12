import express from "express";
import axios from "axios";
const app = express();
const PORT = process.env.PORT || 3000;
import dotenv from "dotenv";
dotenv.config();

app.use((err, req, res, next) => {
    console.error('Middleware de Erro:', err); // Adicione esta linha para depuração
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Rota para listar shows por banda utilizando JamBase API
app.get("/artists/search/:band", async (req, res) => {
    const { band } = req.params;

    try {
        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/artists?apikey=${process.env.API_KEY_JAMBASE}&artistName=${band}`
        );

        if (response.data.success) {
            return res.status(200).json(response.data.artists);
        }

        return res.status(404).json({ error: "Artista não encontrado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Rota para listar apenas informações unicas de um artista

app.get("/artists/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/artists/id/${id}?apikey=${process.env.API_KEY_JAMBASE}`
        );

        if (response.data.success) {
            return res.status(200).json(response.data.artist);
        }

        return res.status(404).json({ error: "Artista não encontrado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Rotas para listar generos

app.get("/genres", async (req, res) => {
    try {
        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/genres?apikey=${process.env.API_KEY_JAMBASE}`
        );

        if (response.data.success) {
            return res.status(200).json(response.data.genres);
        }

        return res.status(404).json({ error: "Genero não encontrado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Rota para listar artistas por genero

app.get("/artists/genre/:genre", async (req, res) => {
    const { genre } = req.params;

    try {
        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/artists?apikey=${process.env.API_KEY_JAMBASE}&genreSlug=${genre}`
        );

        if (response.data.success) {
            return res.status(200).json(response.data.artists);
        }

        return res.status(404).json({ error: "Artista não encontrado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Rota para listar shows por banda

app.get("/shows/:band", async (req, res) => {
    const { band } = req.params;

    try {
        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/events?artistId=${band}&apikey=${process.env.API_KEY_JAMBASE}`
        );

        if (response.data.success) {
            if (response.data.events.length === 0) {
                return res.status(404).json({ error: "Shows não encontrados" });
            }

            return res.status(200).json(response.data.events);
        }

        return res.status(404).json({ error: "Show não encontrado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Rota para listar shows por banda e pais

app.get("/shows/:band/:country", async (req, res) => {
    const { band, country } = req.params;

    try {
        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/events?artistId=${band}&apikey=${process.env.API_KEY_JAMBASE}&geoCountryIso2=${country}`
        );

        if (response.data.success) {
            return res.status(200).json(response.data.events);
        }

        return res.status(404).json({ error: "Show não encontrado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Rota para listar shows por pais

app.get("/shows/country/:country", async (req, res) => {
    return res.status(404).json({ error: "Rota não implementada" });
})


// app.get("/shows/country/:country", async (req, res) => {
//     const { country } = req.params;
//     console.log('Country:', country); // Adicione esta linha para depuração

//     try {
//         const response = await axios.get(
//             `https://www.jambase.com/jb-api/v1/events?apikey=${process.env.API_KEY_JAMBASE}&geoCountryIso2=${country}`
//         );

//         console.log('Response Data:', response.data); // Adicione esta linha para depuração

//         if (response.data.success) {
//             return res.status(200).json(response.data.events);
//         }

//         return res.status(404).json({ error: "Show não encontrado" });
//     } catch (err) {
//         console.error('Error:', err.response ? err.response.data : err.message); // Adicione esta linha para depuração
//         return res.status(500).json({ error: err.message });
//     }
// });

// Rota para buscar cidades

app.get("/cities/search/:city/:state/:country", async (req, res) => {
    const { city, state, country } = req.params;

    try {
        // pegar latitude e longitude da cidade, estado e país

        const responseGeolocation = await axios.get(
            `https://geocode.xyz/${city},${state},${country}?json=1`
        );

        if (responseGeolocation.data.error) {
            return res.status(404).json({ error: "Cidade não encontrada" });
        }

        const latitude = responseGeolocation.data.latt;
        const longitude = responseGeolocation.data.longt;

        const response = await axios.get(
            `https://www.jambase.com/jb-api/v1/geographies/cities?apikey=${process.env.API_KEY_JAMBASE}&geoLatitude=${latitude}&geoLongitude=${longitude}`
        );

        if (response.data.success) {
            return res.status(200).json(response.data.cities);
        }

        return res.status(404).json({ error: "Cidade não encontrada" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
