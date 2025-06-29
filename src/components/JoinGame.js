import React, {useState} from 'react';
import {useChatContext, Channel} from 'stream-chat-react'
import Game from './Game';
import { v4 as uuidv4 } from "uuid";
import "./Auth.css";

function JoinGame() {
    const [rivalUsername, setRivalUsername] = useState("");
    const {client} =useChatContext();
    const [channel, setChannel] = useState(null);

    const createChannel = async () => {
  const response = await client.queryUsers({ name: { $eq: rivalUsername } });

  if (response.users.length === 0) {
    alert("Usuario no encontrado");
    return;
  }

  const rivalId = response.users[0].id;

  if (rivalId === client.userID) {
    alert("¡No puedes elegirte a ti mismo como rival!");
    return;
  }

  const ids = [client.userID, rivalId].sort();
  const isX = ids[0] === client.userID;

  // 🔎 Buscar si ya existe un canal con ambos miembros
  const existingChannels = await client.queryChannels({
    members: { $eq: [client.userID, rivalId] },
  });

  let channel;

  if (existingChannels.length > 0) {
    // Ya existe un canal entre estos dos usuarios
    channel = existingChannels[0];
  } else {
    // Crear nuevo canal con ID único
    const channelId = uuidv4();
    channel = client.channel("messaging", channelId, {
      members: [client.userID, rivalId],
      playerX: ids[0],
      playerO: ids[1],
    });
  }

  await channel.watch();
  setChannel(channel);
};

    return (
        <>
            {channel ? (
                <Channel channel={channel}>
                    <Game channel={channel}/>
                </Channel>
            ) : (
            <div className='auth-container JoinGame'>
                <h4>Crear Juego</h4>
                <input placeholder="Ingresar el nombre del rival" 
                onChange={(Event) =>{
                    setRivalUsername(Event.target.value)
                    }}
                />

                <button onClick={createChannel}> Join/Start Game</button>
            </div>
            )}
        </>
    );
}

export default JoinGame;