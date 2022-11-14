# chatbot-anticonceptivos

Chatbot informativo sobre métodos anticonceptivos

## Descripción

Para ejecutar el chatbot en local, realizar los siguientes pasos (Terminal de Powershell):

1. Clonar el repositorio

```bash
git clone (link del repo)
```

2. Entrar a la carpeta del proyecto

```bash
cd chatbot-anticonceptivos
```

3. Instalar las dependencias

```bash
python3 -m venv venv
venv\Scripts\activate
(venv) pip install Flask torch torchvision nltk
```

4. Entrenar el modelo

```bash
(venv) python train.py
```

5. Ejecutar el chatbot

```bash
(venv) python app.py
```
