# Vercel Deployment

## Root Directory

- Vercel project root: `medical-consultation-app`

## Required Environment Variables On Vercel

- `NEXT_PUBLIC_BACKEND_URL`: URL ngrok cua backend CPU local
- `NEXT_PUBLIC_DEFAULT_GPU_URL`: URL ngrok cua backend GPU Colab
- `BACKEND_URL`: URL ngrok cua backend CPU local
- `INTERNAL_LLM_URL`: `https://<cpu-ngrok>/v1/chat/completions`
- `INTERNAL_FRIEND_CHAT_URL`: `https://<cpu-ngrok>/v1/friend-chat/completions`
- `INTERNAL_HEALTH_LOOKUP_URL`: `https://<cpu-ngrok>/v1/health-lookup`
- `INTERNAL_HEALTH_DB_URL`: `https://<cpu-ngrok>`
- `DEFAULT_GPU_URL`: URL ngrok cua backend GPU Colab
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client id neu dung dang nhap Google
- `GEMINI_API_KEY`: chi can khi van dung Gemini service

## Runtime Notes

- Frontend tren Vercel khong duoc goi `localhost`, vi vay toan bo client fetch phai di qua `NEXT_PUBLIC_BACKEND_URL`.
- CPU backend van chay local nhu cu, nhung phai expose ra internet bang ngrok.
- GPU backend van chay Colab nhu cu, lay URL tu ngrok va cap nhat vao dashboard admin hoac `DEFAULT_GPU_URL`.
- Khong commit file `.env`; chi commit `.env.example`.
