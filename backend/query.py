# 02_query.py
# Fase de query: pergunta → embedding → busca → prompt → resposta com fontes

import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

# ─────────────────────────────────────────────
# Carrega o banco vetorial existente (sem re-embeddar)
# ─────────────────────────────────────────────
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="meu_rag"
)

print(f"Banco carregado: {vectorstore._collection.count()} vetores disponíveis\n")

# ─────────────────────────────────────────────
# Retriever
# ─────────────────────────────────────────────
# MMR (Maximum Marginal Relevance): busca 20 candidatos e seleciona os 5
# que maximizam relevância E diversidade — evita chunks quase idênticos.
# lambda_mult: 0=máxima diversidade, 1=máxima relevância.
# Para comparar com outras estratégias, veja 04_retriever_melhorado.py.
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20, "lambda_mult": 0.5}
)

# ─────────────────────────────────────────────
# Prompt template
# ─────────────────────────────────────────────
PROMPT_TEMPLATE = """
You are a specialized Dungeons & Dragons 5th Edition assistant.
Your role is to answer questions using ONLY the information provided in the retrieved context from the RAG system.
You help players and dungeon masters with:
    * game rules
    * combat mechanics
    * spells
    * classes
    * subclasses
    * feats
    * conditions
    * monsters
    * equipment
    * lore
    * campaign mechanics
MANDATORY RULES:
1. Answer ONLY using the provided context.
2. Never invent rules, mechanics, lore, or details that are not explicitly present in the context.
3. If the information is incomplete, respond with:
   " I could not find enough information in the available documents."
4. If the answer does not exist in the context, respond EXACTLY with:
   "I could not find that information in the available documents."
5. Always explain rules clearly and in an organized way.
6. When possible, include:
* requirements
* limitations
* duration
* range
* actions required
* important effects
* conditions
7. For comparison questions:
* compare using bullet points
* highlight important differences
8. For procedural questions:
* explain step-by-step
9. For build-related questions:
* only use information from the provided context
* never invent undocumented combinations
10. At the end of every answer, include the sources in the following format:

─────────────────────────────
Context from:
{contexto}
─────────────────────────────

PERGUNTA: {pergunta}
"""

prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

# llama-3.3-70b-versatile: modelo gratuito no Groq, muito capaz
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

# ─────────────────────────────────────────────
# Função de query com inspeção dos chunks
# ─────────────────────────────────────────────
def perguntar(pergunta: str, mostrar_chunks: bool = True) -> str:
    print(f"\n{'='*60}")
    print(f"PERGUNTA: {pergunta}")
    print('='*60)

    # Busca os chunks relevantes
    chunks_relevantes = retriever.invoke(pergunta)

    # Mostra o que foi recuperado (para aprendizado)
    if mostrar_chunks:
        print(f"\n── {len(chunks_relevantes)} chunks recuperados ─────────────────")
        for i, chunk in enumerate(chunks_relevantes):
            fonte = chunk.metadata.get("source", "desconhecido")
            pagina = chunk.metadata.get("page", "?")
            print(f"\n[Chunk {i+1}] {fonte} | Página {pagina}")
            print(f"{chunk.page_content[:250]}...")
        print("─────────────────────────────────────────────────────\n")

    # Monta o contexto para o prompt
    contexto_formatado = "\n\n".join([
        f"[Fonte: {c.metadata.get('source', '?')} | Página: {c.metadata.get('page', '?')}]\n"
        f"{c.page_content}"
        for c in chunks_relevantes
    ])

    # Chama o LLM
    mensagens = prompt.format_messages(
        contexto=contexto_formatado,
        pergunta=pergunta
    )
    resposta = llm.invoke(mensagens)

    print(f"RESPOSTA:\n{resposta.content}")
    return resposta.content


# ─────────────────────────────────────────────
# Perguntas de teste — Programa CSSA-366 (Jala University)
# ─────────────────────────────────────────────
PERGUNTAS_TESTE = [
# 1. Direct fact — specific rule or mechanic
"How does concentration work in Dungeons & Dragons 5e?",

# 2. Synthesis — combines multiple sections or mechanics
"What are the main differences between Wizards and Sorcerers in D&D 5e?",

# 3. Procedure — step-by-step explanation
"What are the steps to create a level 1 character in D&D 5e?",

# 4. Comparison — compare two mechanics
"What is the difference between a short rest and a long rest?",

# 5. Negative test — information NOT present in the documents
"How does Super Saiyan transformation work in official D&D 5e?",

]

if __name__ == "__main__":
    for pergunta in PERGUNTAS_TESTE:
        perguntar(pergunta)
        input("\n[Enter para próxima pergunta...]")