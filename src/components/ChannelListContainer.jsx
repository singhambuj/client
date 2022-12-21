import React, { useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import Cookies from "universal-cookie";

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from "./";
import LetsTalk from "../assets/letstalk.png";
import LogoutIcon from "../assets/logout.png";

const cookies = new Cookies();

const SideBar = ({ logout }) => (
	<div className="channel-list__sidebar">
		<div className="channel-list__sidebar__icon1">
			<div className="icon1__inner">
				<img src={LetsTalk} alt="LetsTalk" width="30" />
			</div>
		</div>
		<div className="channel-list__sidebar__icon2">
			<div className="icon1__inner" onClick={logout}>
				<img src={LogoutIcon} alt="Logout" width="30" />
			</div>
		</div>
	</div>
);

const CompanyHeader = () => (
	<div className="channel-list__header">
		<p className="channel-list__header__text">LetsTalk</p>
	</div>
);

const customChannelTeamFilter = (channels) => {
	return channels.filter((channel) => channel.type === "team");
};
const customChannelMessagingFilter = (channels) => {
	return channels.filter((channel) => channel.type === "messaging");
};

const ChannelListContent = ({
	isCreating,
	setIsCreating,
	setCreateType,
	setIsEditing,
	setToggleContainer,
}) => {
	const { client } = useChatContext();
	const logout = () => {
		cookies.remove("token");
		cookies.remove("userId");
		cookies.remove("username");
		cookies.remove("fullName");
		cookies.remove("avatarURL");
		cookies.remove("hashedPassword");
		cookies.remove("phoneNumber");

		window.location.reload();
	};

	const filters = { member: { $in: [client.userID] } };

	return (
		<>
			<SideBar logout={logout} />
			<div className="channel-list__list__wrapper">
				<CompanyHeader />
				<ChannelSearch  setToggleContainer={setToggleContainer}/>
				<ChannelList
					filters={filters}
					channelRenderFilterFn={customChannelTeamFilter} // be careful in future it's removing parentheses ( ) on save.
					List={(listProps) => (
						<TeamChannelList
							{...listProps}
							type="team"
							isCreating={isCreating}
							setIsCreating={setIsCreating}
							setCreateType={setCreateType}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
						/>
					)}
					Preview={(previewProps) => (
						<TeamChannelPreview
							{...previewProps}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
							type="team"
						/>
					)}
				/>
				<ChannelList
					filters={filters}
					channelRenderFilterFn={customChannelMessagingFilter} // be careful in future it's removing parentheses ( ) on save.
					List={(listProps) => (
						<TeamChannelList
							{...listProps}
							type="messaging"
							isCreating={isCreating}
							setIsCreating={setIsCreating}
							setCreateType={setCreateType}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
						/>
					)}
					Preview={(previewProps) => (
						<TeamChannelPreview
							{...previewProps}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
							setToggleContainer={setToggleContainer}
							type="messaging"
						/>
					)}
				/>
			</div>
		</>
	);
};

const ChannelListContainer = ({
	setCreateType,
	setIsCreating,
	setIsEditing,
}) => {
	// it will give cool animation
	const [toggleContainer, setToggleContainer] = useState(false);

	return (
		<>
			{/* for desktop animation */}
			<div className="channel-list__container">
				<ChannelListContent
					setIsCreating={setIsCreating}
					setCreateType={setCreateType}
					setIsEditing={setIsEditing}
				/>
			</div>

			<div
				className="channel-list__container-responsive"
				style={{
					left: toggleContainer ? "0%" : "-89%",
					backgroundColor: "005fff",
				}}
			>
				<div
					className="channel-list__container-toggle"
					onClick={() =>
						setToggleContainer((prevToggleContainer) => !prevToggleContainer)
					}
				>
					{/* for mobile animation  */}
				</div>
				<ChannelListContent
					setIsCreating={setIsCreating}
					setCreateType={setCreateType}
					setIsEditing={setIsEditing}
					setToggleContainer={setToggleContainer}
				/>
			</div>
		</>
	);
};

export default ChannelListContainer;
