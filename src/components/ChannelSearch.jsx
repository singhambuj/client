import React, { useState, useEffect } from "react";
import { getChannel, useChatContext } from "stream-chat-react";

import { ResultsDropdown } from "./";
import { SearchIcon } from "../assets";

const ChannelSearch = ({ setToggleContainer }) => {
	const { client, setActiveChannel } = useChatContext();
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [teamChannel, setTeamChannel] = useState([]);
	const [directChannels, setDirectChannels] = useState([]);

	useEffect(() => {
		if (!query) {
			setTeamChannel([]);
			setDirectChannels([]);
		}
	}, [query]);

	const getChannels = async (text) => {
		try {
			const channelResponse = client.queryChannels({
				type: "team",
				name: { $autocomplete: text },
				members: { $in: [client.userID] },
			});
			const userResponse = client.queryUsers({
				id: { $ne: client.userID },
				name: { $autocomplete: text },
			});

			const [channels, { users }] = await Promise.all([
				channelResponse,
				userResponse,
			]); // this will show users as soon we start typing in realtime will not have to wait to load (if we would use await in above code so we would have to wait for it)

			if (channels.length) setTeamChannel(channels);
			if (users.length) setDirectChannels(users);
		} catch (error) {
			setQuery("");
		}
	};

	const onSearch = (event) => {
		event.preventDefault();

		setLoading(true);
		setQuery(event.target.value);
		getChannels(event.target.value);
	};
	const setChannel = (channel) => {
		setQuery("");
		setActiveChannel(channel);
	};

	return (
		<div className="channel-search__container">
			<div className="channel-search__input__wrapper">
				<div className="channel-search__input__icon">
					<SearchIcon />
				</div>
				<input
					className="channel-search__input__text"
					placeholder="Search"
					type="text"
					value={query}
					onChange={onSearch}
				/>
			</div>
			{query && (
				<ResultsDropdown
					teamChannel={teamChannel}
					directChannels={directChannels}
					loading={loading}
					setChannel={setChannel}
					setQuery={setQuery}
					setToggleContainer={setToggleContainer}
				/>
			)}
		</div>
	);
};

export default ChannelSearch;
